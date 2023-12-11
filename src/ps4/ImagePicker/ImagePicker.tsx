type Props = {
  onImageChange: (image: string) => void;
};

const ImagePicker: React.FC<Props> = (props) => {
  const { onImageChange } = props;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const url = URL.createObjectURL(file);
    onImageChange(url);
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
    </div>
  );
};

export default ImagePicker;
