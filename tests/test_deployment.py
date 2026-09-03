import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class DeploymentConfigTests(unittest.TestCase):
    def test_nginx_only_exposes_expected_paths(self):
        config = (ROOT / "deploy" / "nginx.conf.template").read_text(encoding="utf-8")
        self.assertIn("location / {", config)
        self.assertIn("proxy_pass http://app:8765;", config)
        self.assertIn("proxy_set_header X-Real-IP $remote_addr;", config)
        self.assertNotIn("allow ${ALLOWED_IP};", config)
        self.assertNotIn("alias /data/data.js", config)

    def test_compose_keeps_api_internal_and_persists_data(self):
        compose = (ROOT / "compose.yaml").read_text(encoding="utf-8")
        self.assertIn("TRAIN_DATA_DIR: /data", compose)
        self.assertIn('TRAIN_AUTH_ENABLED: "1"', compose)
        self.assertIn("TRAIN_AUTH_PASSWORD_HASH", compose)
        self.assertIn("TRAIN_SESSION_SECRET", compose)
        self.assertIn("/opt/footpoint-atlas-data", compose)
        self.assertNotIn("8765:8765", compose)
        self.assertIn('\"127.0.0.1:8080:80\"', compose)
        self.assertIn("no-new-privileges:true", compose)

    def test_docker_build_does_not_copy_local_secrets(self):
        ignore = (ROOT / ".dockerignore").read_text(encoding="utf-8")
        ignore_lines = ignore.splitlines()
        self.assertTrue(
            any(line in {".env", ".env*"} for line in ignore_lines),
            ".dockerignore 必须排除 .env 文件",
        )
        self.assertIn(".git", ignore_lines)
        self.assertIn("/etc/nginx/conf.d/default.conf:ro", (ROOT / "compose.yaml").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
