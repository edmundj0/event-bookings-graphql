## Getting Started

1. Clone this repository

2. Install dependencies

    ```bash
    npm install
    ```

3. Create **.env** file in root directory, and create MONGO_USER, MONGO_PASSWORD, and MONGO_DB variables based MongoDB info

    ```
    MONGO_USER=dbname
    MONGO_PASSWORD=mongoDBinstancepassword
    MONGO_DB=mongo-db
    ```

4. Start backend server

    ```bash
    npm start
    ```

5. Make Dynamic queries!

    ```
    query {
    events {
        date
        title
        creator {
            email
            createdEvents {
                title
                creator {
                    email
                    }
                }
            }
        }
    }
    ```
