import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()


class DatabaseManager:
    def __init__(self):
        self._client = None
        self._db = None

    def _build_client(self):
        return AsyncIOMotorClient(os.getenv("MONGODB_URI"))

    @property
    def client(self):
        if self._client is None:
            self._client = self._build_client()
        return self._client

    @property
    def db(self):
        if self._db is None:
            database_name = os.getenv("DATABASE_NAME")
            if not database_name:
                raise RuntimeError("DATABASE_NAME is not configured")
            self._db = self.client[database_name]
        return self._db


class LazyDatabase:
    def __init__(self, manager):
        self._manager = manager

    def __getitem__(self, name):
        return self._manager.db[name]

    def __getattr__(self, name):
        return getattr(self._manager.db, name)


mongo_manager = DatabaseManager()
db = LazyDatabase(mongo_manager)