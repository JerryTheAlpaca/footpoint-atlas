import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class DeploymentConfigTests(unittest.TestCase):
    def test_nginx_only_exposes_expected_paths(self):
        config = (ROOT / "deploy" / "nginx.conf.template").read_text(encoding="utf-8")
        self.assertIn("allow ${ALLOWED_IP};", config)
        self.assertIn("deny all;", config)
        self.assertIn("location = /api/train-data", config)
        self.assertIn("location = /api/save-train-data", config)
        self.assertIn("location / {\n        return 404;", config)
        self.assertNotIn("火车乘车记录.xlsx", config)

    def test_compose_keeps_api_internal_and_persists_data(self):
        compose = (ROOT / "compose.yaml").read_text(encoding="utf-8")
        self.assertIn("TRAIN_DATA_DIR: /data", compose)
        self.assertIn("/opt/footpoint-atlas-data", compose)
        self.assertNotIn("8765:8765", compose)
        self.assertIn('\"8080:80\"', compose)
        self.assertIn("no-new-privileges:true", compose)


if __name__ == "__main__":
    unittest.main()
