## Installation

1. Initialize a new React project (if you don't already have one):
    ```bash
    npx create-react-app my-app --template typescript
    cd my-app
    ```

2. Install necessary dependencies (no additional dependencies required for the provided script):
    ```bash
    npm install
    # or
    yarn install
    ```

## Configuration

1. Ensure you have pre-signed URLs generated for your S3 bucket for the files you want to upload. These URLs will be used as the `destinationUrl` parameter in the script.

## Usage

1. Create an `AWSS3.ts` file in the `src` directory of your React project and add the following code:

    ```typescript
    // src/AWSS3.ts
    export class AWSS3 {
        public async uploadFile(destinationUrl: string, localFileUri: string): Promise<boolean> {
            const imageBody = await this.getBlob(localFileUri);
            const resp = await fetch(destinationUrl, {
                method: 'PUT',
                body: imageBody
            });
            return resp.ok;
        }

        private async getBlob(fileUri: string) {
            const resp = await fetch(fileUri);
            const imageBody = await resp.blob();
            return imageBody;
        }
    }
    ```

2. Use the `AWSS3` class in your components to upload files. Here's an example of how to use it in a component:

    ```typescript
    // src/FileUpload.tsx
    import React, { useState } from 'react';
    import { AWSS3 } from './AWSS3';

    const FileUpload: React.FC = () => {
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const [destinationUrl, setDestinationUrl] = useState<string>('');

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
                setSelectedFile(URL.createObjectURL(event.target.files[0]));
            }
        };

        const handleUpload = async () => {
            if (!selectedFile || !destinationUrl) return;

            const awsS3 = new AWSS3();
            const success = await awsS3.uploadFile(destinationUrl, selectedFile);

            if (success) {
                alert('File uploaded successfully');
            } else {
                alert('Error uploading file');
            }
        };

        return (
            <div>
                <input
                    type="text"
                    placeholder="Destination URL"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                />
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>
        );
    };

    export default FileUpload;
    ```

3. Import and use the `FileUpload` component in your `App.tsx` file:

    ```typescript
    // src/App.tsx
    import React from 'react';
    import FileUpload from './FileUpload';

    const App: React.FC = () => {
        return (
            <div className="App">
                <h1>Upload File to AWS S3</h1>
                <FileUpload />
            </div>
        );
    };

    export default App;
    ```

4. Start the development server:
    ```bash
    npm start
    # or
    yarn start
    ```

The application will run on `http://localhost:3000`, and you can use the file upload component to upload files to your S3 bucket using the pre-signed URL.

## AWS S3 Setup

1. **Create an S3 Bucket**: Log in to your AWS account and create a new S3 bucket. Note down the bucket name.

2. **Generate Pre-signed URLs**: Generate pre-signed URLs for the files you want to upload to your S3 bucket. These URLs will be used as the `destinationUrl` parameter in the script.

3. **Configure CORS**: Set up the CORS policy for your S3 bucket to allow requests from your application's domain. Example CORS configuration:
    ```json
    [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
      }
    ]
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
