import pyodbc

# Configuration for SQL Server Connection
# Replace 'DESKTOP-XXXXXX\SQLEXPRESS' or 'localhost' with your actual SQL Server instance name if needed
SERVER = 'localhost\\SQLEXPRESS' 
DATABASE = 'lexihunt_app_db'
DRIVER = '{ODBC Driver 17 for SQL Server}' # Or '{SQL Server}' depending on what you have installed

def get_db_connection():
    try:
        connection_string = f"DRIVER={DRIVER};SERVER={SERVER};DATABASE={DATABASE};Trusted_connection=yes;"
        connection = pyodbc.connect(connection_string)
        print("Database connection successful!")
        return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

if __name__ == "__main__":
    get_db_connection()