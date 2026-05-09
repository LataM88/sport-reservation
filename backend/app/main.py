from fastapi import FastAPI

app = FastAPI(
    title="fastAPI",
    description="Backend",
    version="1.0.0"
)

@app.get("/")
def test_endpoint():
    return {"message": "Działa"}