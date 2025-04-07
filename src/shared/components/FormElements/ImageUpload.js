import React, { useRef, useState, useEffect } from 'react';
import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!files || files.length === 0) {
      return;
    }
    
    const fileReaders = [];
    let isCancel = false;
    
    files.forEach(file => {
      const fileReader = new FileReader();
      fileReaders.push(fileReader);
      
      fileReader.onload = () => {
        if (isCancel) return;
        setPreviewUrls(prev => [...prev, fileReader.result]);
      };
      fileReader.readAsDataURL(file);
    });

    return () => {
      isCancel = true;
      fileReaders.forEach(fileReader => {
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
      });
    };
  }, [files]);

  const pickedHandler = event => {
    let pickedFiles = [];
    let filesAreValid = false;
    
    if (event.target.files && event.target.files.length > 0) {
      pickedFiles = Array.from(event.target.files).slice(0, 5); // Limit to 5 files
      setFiles(pickedFiles);
      setPreviewUrls([]); // Clear previous previews
      setIsValid(true);
      filesAreValid = true;
    } else {
      setIsValid(false);
      filesAreValid = false;
    }
    
    props.onInput(props.id, pickedFiles, filesAreValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
        multiple
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrls.length > 0 ? (
            previewUrls.map((url, index) => (
              <img key={index} src={url} alt={`Preview ${index}`} />
            ))
          ) : (
            <p>Please pick one or more images (up to 5).</p>
          )}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGES
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;