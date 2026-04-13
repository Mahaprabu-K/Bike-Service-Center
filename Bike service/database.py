import pyodbc

def get_connection():
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=KISHORE\\SQLEXPRESS;"
        "DATABASE=Bikeservicedb;"
        "Trusted_Connection=yes;"
    )
    return conn