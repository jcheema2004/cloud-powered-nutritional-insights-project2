import azure.functions as func
import os
import json
import pandas as pd
import io
from azure.storage.blob import BlobServiceClient

app = func.FunctionApp()

@app.route(route="nutritional_data", auth_level=func.AuthLevel.ANONYMOUS)
def get_diet_insights(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # 1. Securely fetch connection string
        connect_str = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
        
        # 2. Blob Logic
        blob_service_client = BlobServiceClient.from_connection_string(connect_str)
        blob_client = blob_service_client.get_blob_client(container="datasets", blob="All_Diets.csv")
        stream = blob_client.download_blob().readall()
        df = pd.read_csv(io.BytesIO(stream))

        # 3. Convert the whole table to JSON
        # .to_dict(orient='records') is so each row is a JSON object
        result = df.to_dict(orient='records')

        # 4. Return the full data to the UI
        return func.HttpResponse(
            body=json.dumps(result),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)