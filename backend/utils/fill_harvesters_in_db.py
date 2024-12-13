from tasks_shared.database_utils import get_session
from tasks_shared.models.harvester.repository import HarvesterRepository
from settings import settings
from pathlib import Path
import pandas as pd 

download_file = Path(f"{settings.download_path}/harvesters.csv")


async def fill_harvesters_in_db():
    df = pd.read_csv(str(download_file), sep=";")
    json = df.to_dict(orient='records')
    print(json)
    async with get_session() as session:
        for harvester in json:
            harvester["photo_url"] = f"{settings.bucket_name}/{harvester.get('name')}.jpg"
            await HarvesterRepository(session).add(model_create=harvester)
