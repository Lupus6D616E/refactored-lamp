import { edenTreatyApi } from "@lib/eden";
import { FormEvent, useState } from "react";

type FormDataType = {
  name: string;
  description: string;
  address: string;
  industry: string;
};

export function AddBusinessCard() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    // Native HTML validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);

    const payload: FormDataType = {
      name: data.get("businessName") as string,
      description: data.get("description") as string,
      address: data.get("address") as string,
      industry: data.get("industry") as string,
    };

    await submitForm(payload);
  };

  const submitForm = async (payload: FormDataType) => {
    try {
      setLoading(true);
      const res = await edenTreatyApi.admin.createbusiness.post(payload);
      if (!res.data) {
        throw new Error("Submission failed" + res.error.value);
      }

      const result = res.data;
      console.log("Success:", result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Add Business</h2>

        {/* space-y controls vertical spacing */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content/80">
                Business Name
              </span>
            </label>
            <input
              name="businessName"
              type="text"
              placeholder="W corp"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content/80">
                Address
              </span>
            </label>
            <input
              name="address"
              type="text"
              placeholder="The City"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content/80">
                Description
              </span>
            </label>
            <textarea
              name="description"
              placeholder="don't get on their trains bro "
              className="textarea input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content/80">
                Industry
              </span>
            </label>
            <input
              name="industry"
              type="text"
              placeholder="Time travel"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="card-actions justify-end pt-4">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
