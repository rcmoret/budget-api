const getCSRFToken = () => {
  return document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
};

type putProps = {
  body: any;
};

const put = async (url: string, requestProps: putProps) => {
  const csrfToken = getCSRFToken();

  return await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: JSON.stringify(requestProps.body),
  });
};

type postProps = {
  body: any;
};

const post = async (url: string, requestProps: postProps) => {
  const csrfToken = getCSRFToken();

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: JSON.stringify(requestProps.body),
  });
};

const appClient = {
  post,
  put,
};

export { appClient };
