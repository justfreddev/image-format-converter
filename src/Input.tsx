import { open } from '@tauri-apps/api/dialog';

type InputProps = {
    setInputImage: React.Dispatch<React.SetStateAction<string | null>>,
    setOutputDir: React.Dispatch<React.SetStateAction<string | null>>,
    setImageName: React.Dispatch<React.SetStateAction<string | null>>
}

const Input: React.FC<InputProps> = ({ setInputImage, setOutputDir, setImageName }) => {
    /**
     * Opens a file dialog to select an image.
     */
    const handleImageInput = async () => {
        const image = await open({
            filters: [{
                name: '',
                extensions: ['png', 'jpeg', 'jpg']
            }]
        }) as string;
        if (image) {
            setInputImage(image);
        };
    }

    /**
     * Opens a directory dialog to select an output directory.
     */
    const handleDirectoryInput = async () => {
        const path = await open({ directory: true }) as string;
        if (path) {
            setOutputDir(path);
        };
    }

    /**
     * Sets the output image name.
     */
    const handleImageNameInput = () => {
        const imageName = document.getElementById('image-name') as HTMLInputElement;
        setImageName(imageName.value);
    }

    return (
        <div>
            <label>Upload image: </label>
            <button onClick={handleImageInput}>Upload image</button>
            <br />
            <label>Set output directory: </label>
            <button onClick={handleDirectoryInput}>Select</button>
            <br />
            <label>Output image name: </label>
            <input type="text" id="image-name" />
            <button onClick={handleImageNameInput}>Submit</button>
        </div>
    )

}

export default Input;