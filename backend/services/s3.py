from aiobotocore.session import get_session
from utils.file_manager import read_file_async, write_file_async
from settings import settings

class S3Client:
    def __init__(self):
        self.aws_access_key_id = settings.aws_access_key_id
        self.aws_secret_access_key = settings.aws_secret_access_key.get_secret_value()
        self.region_name = settings.region_name
        self.bucket_name = settings.bucket_name
        self.host = settings.host
        self.download_path = settings.download_path
        self.session = get_session()

    async def upload_file(self, file_path: str, key: str) -> bool:
        try:
            async with self.session.create_client('s3', region_name=self.region_name,
                                    aws_secret_access_key=self.aws_secret_access_key,
                                    aws_access_key_id=self.aws_access_key_id,
                                    endpoint_url=self.host) as client:

                data = await read_file_async(file_path)

                await client.put_object(Bucket=self.bucket_name,
                                                Key=key,
                                                Body=data)
                return True
        except Exception:
            return False

    async def download_file(self, key: str) -> str:
        try:
            async with self.session.create_client('s3', region_name=self.region_name,
                                        aws_secret_access_key=self.aws_secret_access_key,
                                        aws_access_key_id=self.aws_access_key_id,
                                        endpoint_url=self.host) as client:
                data = await client.get_object(Bucket=self.bucket_name, Key=key)
                await write_file_async(self.download_path, await data['Body'].read())
                return self.download_path
        except Exception:
            return None
