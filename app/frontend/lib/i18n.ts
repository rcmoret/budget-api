type I18nTranslateEventOptions = { key: string };

const t_events = (props: { key: string; opts?: I18nTranslateEventOptions }) => {
  const { key, opts } = props;

  const suffix = !!opts?.key ? ` (${opts.key.slice(0, 6).toUpperCase()})` : "";

  switch (key) {
    case "setup_item_create":
      return "New Item" + suffix;
    case "rollover_item_create":
      return "New Item" + suffix;
    case "setup_item_adjust":
      return "Adjust Item" + suffix;
    case "rollover_item_adjust":
      return "Adjust Item" + suffix;
    default:
      return "Unknown event";
  }
};

const determineScope = (props: { scope: string }) => {
  switch (props.scope) {
    case "events":
      return { call: t_events };
    default:
      return { call: (props: { key: string; _opts?: any }) => props.key };
  }
};

type I18NTEvents = {
  scope: "events";
  key: string;
  opts?: I18nTranslateEventOptions;
};

type I18NTOther = {
  scope: string;
  key: string;
  opts?: I18nTranslateEventOptions;
};

type I18NT = I18NTEvents | I18NTOther;

const _t = (props: I18NT) => {
  const fn = determineScope({ scope: props.scope });
  return fn.call({ key: props.key, opts: props.opts });
};

const i18n = {
  t: (scope: string, key: string, opts?: I18nTranslateEventOptions) =>
    _t({ scope, key, opts }),
};

export { i18n };
