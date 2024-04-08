// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use image::io::Reader as ImageReader;
use serde::Serialize;
use std::fmt;

// Error struct to display errors during the conversion process
#[derive(Debug, Serialize)]
struct ConvertingError {
    message: String,
}

// Allows for the ConvertingError to be displayed as a string
impl fmt::Display for ConvertingError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

// Creates a Tauri command to convert an image 
#[tauri::command]
fn convert(input_image: &str, output_dir: &str, image_name: &str) -> Result<(), ConvertingError> {

    // Gets the format of the string from the extension
    let format = input_image.split('.').last().unwrap();

    // Converts the image file into a Dynamic Image that can be worked with
    let img = ImageReader::open(input_image) // Opens the image at a path
        .map_err(|_| ConvertingError { message: "Failed to open image file".to_string() })?
        .with_guessed_format() // Guesses the format based on the content of the image
        .unwrap()
        .decode() // Constructs the correct reader for the format of the image
        .unwrap();

    // Calculates the output format of the image - just reverses the image format
    let output_format = match format {
        "png" => "jpg",
        "jpg" => "png",
        _ => return Err(ConvertingError { message: "Invalid input image format".to_string() }),
    };

    // Convers the image from RGBA -> RGB so it can be converted
    let rgb_img = img.to_rgb8();

    // Sets the output directory for the image
    let output_directory = format!("{}/{}.{}", output_dir, image_name, output_format);

    // Saves the converted image to the output directory
    rgb_img.save(output_directory).map_err(|e| ConvertingError {
        message: format!("Failed to save image to output directory: {}", e),
    })?;

    Ok(())
}

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![convert])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
