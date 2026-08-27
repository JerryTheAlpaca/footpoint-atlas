"""交互式生成部署所需的密码哈希，不保存或输出明文密码。"""

from __future__ import annotations

import getpass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from serve import make_password_hash  # noqa: E402


def main() -> None:
    password = getpass.getpass("请输入登录密码：")
    confirmation = getpass.getpass("请再次输入：")
    if password != confirmation:
        raise SystemExit("两次输入的密码不一致。")
    if len(password) < 12:
        raise SystemExit("密码至少需要 12 个字符。")
    print(make_password_hash(password))


if __name__ == "__main__":
    main()
