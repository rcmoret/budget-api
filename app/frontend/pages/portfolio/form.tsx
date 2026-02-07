import { ImageUploadComponent } from "./image-upload-component";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/common/Button";
import { FormSubmitButton } from "@/lib/theme/buttons/form-submit-button";

type FormProps = {
  description: string;
  image: File | null;
  previewUrl: string | null;
  title: string;
  url: string;
  method: "post" | "put";
  onSuccess: () => void;
  onCancel: () => void;
};

type FormData = {
  description: string;
  image: File | null;
  title: string;
};

const PortfolioItemComponent = (props: FormProps) => {
  const { data, setData, processing, post, put } = useForm<FormData>({
    title: props.title,
    description: props.description,
    image: props.image,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const options = {
      onSuccess: props.onSuccess,
      preserveState: true,
    };

    if (props.method === "post") {
      post(props.url, options);
    } else {
      put(props.url, options);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4 bg-white h-full"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(ev) => setData({ ...data, title: ev.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
          required
          maxLength={40}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={data.description}
          onChange={(ev) => setData({ ...data, description: ev.target.value })}
          className="w-full p-2 border border-gray-300 rounded min-h-[100px]"
          required
          maxLength={400}
        />
      </div>
      <ImageUploadComponent
        image={data.image}
        previewUrl={props.previewUrl}
        title={data.title}
        description={data.description}
        setData={(newData) => setData({
          title: newData.title,
          description: newData.description,
          image: newData.image
        })}
      />
      <div className="flex gap-2">
        <FormSubmitButton isEnabled={!processing}>Submit</FormSubmitButton>
        <Button type="button" onClick={props.onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PortfolioItemComponent;
