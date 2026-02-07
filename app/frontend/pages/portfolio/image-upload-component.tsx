import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { useRef, useState } from "react";

type FormProps = {
  description: string;
  image: File | null;
  previewUrl: string | null;
  title: string;
};

type ImageComponentProps = {
  image: File | null;
  previewUrl: string | null;
  description: string;
  title: string;
  setData: (p: FormProps) => void;
};

const ImageUploadComponent = (props: ImageComponentProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(props.previewUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const data = {
    title: props.title,
    previewUrl,
    description: props.description,
  };

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];

    if (!file) return;

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];

    if (!validTypes.includes(file.type)) {
      alert("Please upload a PNG, JPG, or PDF file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File must be less than 10MB");
      return;
    }

    props.setData({ ...data, image: file });

    // Create preview for images only
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    props.setData({ ...data, image: null });
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <Button type="button" onClick={handleClick}>
          <span className="text-gray-600">
            <Icon name="paperclip" />
          </span>
        </Button>

        {!!props.image && (
          <div className="flex flex-row gap-2 items-center">
            <Button type="button" onClick={handleRemove}>
              <span className="text-red-600">
                <Icon name="times-circle" />
              </span>
            </Button>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Image preview"
            className="max-w-32 max-h-32 border border-gray-300 rounded"
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export { ImageUploadComponent };
