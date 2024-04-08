import { invoke } from '@tauri-apps/api';
import { useState } from 'react';
import './App.css'
import Input from './Input';

function App() {
    // State variables
    const [inputImage, setInputImage] = useState<string | null>(null);
    const [outputDir, setOutputDir] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    /**
     * Invokes the convert function in the Tauri backend.
     */
    const convert = () => {
        setSuccess(false);
        invoke('convert', { inputImage, outputDir, imageName })
            .then((response) => {
                if (response != null) {
                    setSuccess(false);
                } else {
                    setSuccess(true);
                }
            }
        );
    }

    return (
        <div>
            <Input setInputImage={setInputImage} setOutputDir={setOutputDir} setImageName={setImageName} />
            <h4>Uploaded image: {inputImage}</h4>
            <h4>Output directory: {outputDir}</h4>
            <h4>Output image name: {imageName}</h4>
            <button onClick={convert}>Convert</button>
            <h3>{success ? 'Conversion successful!' : ''}</h3>
        </div>
    )
}

export default App
