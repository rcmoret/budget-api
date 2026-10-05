import { Link } from "@inertiajs/react";
import { GroupLabel } from "@/components/group-label";
import {
  useFeaturedCategory,
  useFeaturedItems,
  useNeighborLinks,
  useShowReviewedCategories,
} from "../store";
import { ItemCard } from "./item";

const FormLinks = () => {
  const links = useNeighborLinks();
  const { toggleValue: showReviewed } = useShowReviewedCategories();

  const previous = showReviewed
    ? { label: links.previousCategoryName, href: links.previousCategoryHref }
    : {
        label: links.previousUnreviewedCategoryName,
        href: links.previousUnreviewedCategoryHref,
      };
  const next = showReviewed
    ? { label: links.nextCategoryName, href: links.nextCategoryHref }
    : {
        label: links.nextUnreviewedCategoryName,
        href: links.nextUnreviewedCategoryHref,
      };

  return (
    <div className="col-span-full flex justify-between">
      <div className="grid gap-1">
        <div className="underline">previous</div>
        {previous.href && <Link href={previous.href}>{previous.label}</Link>}
      </div>
      <div className="grid gap-1">
        <div className="underline text-right">next</div>
        {next.href && <Link href={next.href}>{next.label}</Link>}
      </div>
    </div>
  );
};

const FeaturedCategoryComponent = () => {
  const category = useFeaturedCategory();
  const items = useFeaturedItems();

  if (items.length === 0) {
    return <div className="p-1">Nothing to roll over this month.</div>;
  }

  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-x-2 gap-y-4 p-1 content-start">
      <div className="col-span-full">
        <GroupLabel>{category.name}</GroupLabel>
      </div>
      {items.map((item) => (
        <ItemCard key={item.key} item={item} />
      ))}
      <FormLinks />
    </div>
  );
};

export { FeaturedCategoryComponent };
