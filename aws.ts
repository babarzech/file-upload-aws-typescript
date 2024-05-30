export class AWSS3 {
    public async uploadFile(destinationUrl: string, localFileUri: string): Promise<boolean> { // give destination url and and localurl 
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
    };
}
