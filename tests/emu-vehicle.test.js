const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadSettings() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'settings.js'), 'utf8');
  const sandbox = {};
  const fn = new Function('window', 'globalThis', code + '\nreturn window.TrainSettings;');
  return fn(sandbox, sandbox);
}

const settings = loadSettings();
const appCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

describe('车号查询的客户端判据', () => {
  it('走服务端代理，不在前端直连上游', () => {
    assert.equal(settings.EMU_API, '/api/emu-unit');
    assert.doesNotMatch(appCode, /https?:\/\/api\.rail\.re/);
    assert.doesNotMatch(appCode, /https?:\/\/kyfw\.12306\.cn/);
    assert.match(appCode, /window\.TrainSettings\.EMU_API \+ query/);
  });

  it('动车组车次才查，普速与空值静默', () => {
    assert.equal(settings.isEmuTrain('D2294'), true);
    assert.equal(settings.isEmuTrain(' g1737次 '), true);
    for (const text of ['K146', 'Z45', '1737', '', 'G', '动车']) {
      assert.equal(settings.isEmuTrain(text), false, text);
    }
  });

  it('复车次写法整串放过，拆号交给服务端', () => {
    assert.equal(settings.isEmuTrain('G1737/736'), true);
    assert.equal(settings.isEmuTrain('G1737/G1736'), true);
    assert.equal(settings.isEmuTrain('G1737/736/735/734/733'), false);
    assert.equal(settings.isEmuTrain('G1737/G1736/'), false);
  });
});

describe('自动填充只填空着或自己填过的车号框', () => {
  it('用手打内容当界标，覆盖前先比对', () => {
    assert.match(appCode, /function vehicleFillAllowed\(\)/);
    assert.match(appCode, /var auto = input\.getAttribute\('data-emu-auto'\) \|\| '';/);
    assert.match(
      appCode,
      /return !input\.value\.trim\(\) \|\| auto === input\.value;/
    );
    assert.match(appCode, /if \(!vehicleFillAllowed\(\)\) return;/);
  });

  it('编辑老记录不自动改它的车号，清空车号框才视为要重查', () => {
    assert.match(appCode, /if \(editingRecord && !force\) return;/);
    assert.match(appCode, /if \(!input\.value\.trim\(\)\) scheduleVehicleLookup\(true\);/);
  });

  it('慢响应不能盖掉后来的输入', () => {
    assert.match(appCode, /var token = emuLookupToken;/);
    assert.match(appCode, /if \(token === emuLookupToken\) applyVehicleLookup\(result\);/);
  });

  it('全程不往状态行写字，查到就填、查不到就留着空', () => {
    const fill = appCode.slice(
      appCode.indexOf('function applyVehicleLookup'),
      appCode.indexOf('function requestVehicleLookup')
    );
    assert.ok(fill.length > 0);
    assert.doesNotMatch(fill, /setTripStatus/);
    const request = appCode.slice(
      appCode.indexOf('function requestVehicleLookup'),
      appCode.indexOf('function scheduleVehicleLookup')
    );
    assert.doesNotMatch(request, /setTripStatus/);
  });
});
