import { Form } from "@inertiajs/react";
import { PageComponent, pageHeadingClassName } from "@/layout";
import { PageProps } from "@/types/page_props";

type TimezoneOption = {
  label: string;
  value: string;
};

type UserProfile = {
  key: string;
  email: string;
  timezone: string;
  timezoneOptions: Array<TimezoneOption>;
};

type UserProfileShowProps = PageProps & {
  user_profile: UserProfile;
};

const fieldClassName = "grid gap-1";
const inputClassName = ["input", "input-sm", "input-secondary", "w-full"].join(
  " ",
);
const selectClassName = [
  "select",
  "select-sm",
  "select-secondary",
  "w-full",
].join(" ");

const TimezoneField = ({ profile }: { profile: UserProfile }) => (
  <div className={fieldClassName}>
    <label htmlFor="user_profile.timezone">Timezone</label>
    <select
      id="user_profile.timezone"
      name="user_profile.timezone"
      className={selectClassName}
      defaultValue={profile.timezone}
    >
      {profile.timezoneOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const PasswordFields = () => (
  <>
    <div className={fieldClassName}>
      <label htmlFor="user_profile.password">New Password</label>
      <input
        id="user_profile.password"
        name="user_profile.password"
        type="password"
        autoComplete="new-password"
        className={inputClassName}
      />
    </div>
    <div className={fieldClassName}>
      <label htmlFor="user_profile.password_confirmation">
        Confirm Password
      </label>
      <input
        id="user_profile.password_confirmation"
        name="user_profile.password_confirmation"
        type="password"
        autoComplete="new-password"
        className={inputClassName}
      />
    </div>
  </>
);

const ProfileForm = ({ profile }: { profile: UserProfile }) => (
  // Inertia dot-notation names nest into params[:user_profile][:...].
  <Form action="/profile" method="put" className="grid gap-4 max-w-md">
    {({ processing }) => (
      <>
        <TimezoneField profile={profile} />
        <PasswordFields />
        <div>
          <button
            type="submit"
            className="btn btn-success"
            disabled={processing}
          >
            Save
          </button>
        </div>
      </>
    )}
  </Form>
);

const Header = () => <h1 className={pageHeadingClassName}>Profile</h1>;

const UserProfileShow = (props: UserProfileShowProps) => {
  const profile = props.user_profile;

  return (
    <PageComponent mainId="user-profile" header={<Header />} rightColumn={null}>
      <div className="grid gap-4 pb-8 max-w-md">
        <div className="text-sm text-base-content/70">{profile.email}</div>
        <ProfileForm profile={profile} />
      </div>
    </PageComponent>
  );
};

export default UserProfileShow;
