import { useState } from "react";
import { useForm } from "@inertiajs/react";
import PortfolioItemForm from "./form";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { Button } from "@/components/common/Button";

type PortfolioItem = {
  key: string;
  title: string;
  description: string;
  imageUrl: string | null;
  contentType: string | null;
};

type IndexProps = {
  about: string;
  allowEdit: boolean;
  portfolioItems: Array<PortfolioItem>;
  email: string;
};

type AboutFormData = {
  about: string;
};

const PortfolioItemFormCard = (props: {
  item: PortfolioItem;
  setEditingItemKey: (p: string | null) => void;
}) => {
  const { item, setEditingItemKey } = props;

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Edit Item</h3>
      <PortfolioItemForm
        title={item.title}
        description={item.description}
        image={null}
        previewUrl={item.imageUrl}
        url={UrlBuilder({ name: "PortfolioUpdateItem", key: item.key })}
        method="put"
        onSuccess={() => setEditingItemKey(null)}
        onCancel={() => setEditingItemKey(null)}
      />
    </div>
  );
};

const PortfolioItemCard = (props: {
  item: PortfolioItem;
  allowEdit: boolean;
  setEditingItemKey: (p: string | null) => void;
}) => {
  const { item, allowEdit, setEditingItemKey } = props;

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
      <p className="text-gray-700 mb-4">{item.description}</p>
      {allowEdit && (
        <Button type="button" onClick={() => setEditingItemKey(item.key)}>
          Edit
        </Button>
      )}
      {item.imageUrl && (
        <div className="w-full h-48 bg-gray-200">
          {item.contentType?.startsWith("image/") ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span>PDF Document</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PortfolioIndexComponent = (props: IndexProps) => {
  const [editingAbout, setEditingAbout] = useState(false);
  const [editingItemKey, setEditingItemKey] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);

  const aboutForm = useForm<AboutFormData>({ about: props.about });

  const handleSaveAbout = () => {
    aboutForm.put(UrlBuilder({ name: "PortfolioUpdateAbout" }), {
      onSuccess: () => setEditingAbout(false),
    });
  };

  const handleCancelAbout = () => {
    aboutForm.setData({ about: props.about });
    setEditingAbout(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* About Me Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">About Me</h2>
        {editingAbout && props.allowEdit ? (
          <div className="space-y-4">
            <textarea
              value={aboutForm.data.about}
              onChange={(e) => aboutForm.setData({ about: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px]"
              placeholder="Tell us about yourself..."
            />
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleSaveAbout}
                isDisabled={aboutForm.processing}
              >
                Save
              </Button>
              <Button
                type="button"
                onClick={handleCancelAbout}
                isDisabled={aboutForm.processing}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 whitespace-pre-wrap">
              {props.about || "No description yet."}
            </p>
            {props.allowEdit && (
              <Button
                type="button"
                onClick={() => setEditingAbout(true)}
                styling={{ margin: "mt-4" }}
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Portfolio Items Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
        {props.allowEdit && (
          <Button
            type="button"
            onClick={() => setCreatingNew(true)}
            styling={{ margin: "mb-4" }}
          >
            Add New Item
          </Button>
        )}
      </div>

      {/* Create New Item Form */}
      {creatingNew && (
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">New Portfolio Item</h3>
          <PortfolioItemForm
            title=""
            description=""
            image={null}
            previewUrl={null}
            url={UrlBuilder({ name: "PortfolioCreateItem" })}
            method="post"
            onSuccess={() => setCreatingNew(false)}
            onCancel={() => setCreatingNew(false)}
          />
        </div>
      )}

      {/* Portfolio Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {props.portfolioItems.map((item) => (
          <div
            key={item.key}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            {editingItemKey === item.key ? (
              <PortfolioItemFormCard
                item={item}
                setEditingItemKey={setEditingItemKey}
              />
            ) : (
              <PortfolioItemCard
                item={item}
                allowEdit={props.allowEdit}
                setEditingItemKey={setEditingItemKey}
              />
            )}
          </div>
        ))}
      </div>

      {props.portfolioItems.length === 0 && !creatingNew && (
        <div className="text-center text-gray-500 py-12">
          No portfolio items yet.
        </div>
      )}
    </div>
  );
};

export default PortfolioIndexComponent;
