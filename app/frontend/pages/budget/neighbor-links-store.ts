import { useEffect } from "react";
import { create } from "zustand";

type NeighborLink = {
  href: string;
  label: string;
};

type NeighborLinksStore = {
  previous: NeighborLink;
  next: NeighborLink;
};

const emptyNeighborLink: NeighborLink = {
  href: "",
  label: "",
};

const useNeighborLinksStore = create<NeighborLinksStore>(() => ({
  previous: emptyNeighborLink,
  next: emptyNeighborLink,
}));

const initNeighborLinksStore = (props: {
  previous: NeighborLink;
  next: NeighborLink;
}) => {
  const { previous, next } = props;

  useEffect(() => {
    useNeighborLinksStore.setState({ previous, next });
    // Key on primitives so callers can pass fresh object literals each render
    // without triggering a re-render loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previous.href, previous.label, next.href, next.label]);
};

const getNeighborLinks = () => useNeighborLinksStore();

export {
  useNeighborLinksStore,
  initNeighborLinksStore,
  getNeighborLinks,
  type NeighborLink,
};
