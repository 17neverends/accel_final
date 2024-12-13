import aiofiles

async def read_file_async(file_path: str) -> str:
    async with aiofiles.open(file_path, mode='rb') as file:
        content = await file.read()
    return content


async def write_file_async(file_path: str, content: str):
    async with aiofiles.open(file_path, mode='wb') as file:
        await file.write(content)
