import "./Create.css";
import Layout from "./Layout";
import Section from "./Section";
import { enqueueSnackbar } from "notistack";

function Create(props) {
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    let form = document.forms[0];
    let submit = document.getElementById("submit");
    submit.setAttribute("disabled", true);

    const formData = new FormData(form);
    await fetch(form.action, {
      method: form.method,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success && res.error)
          enqueueSnackbar(res.error || "Course creation failed", {
            variant: "error",
          });
        else
          enqueueSnackbar(`Course creation initiated`, {
            variant: "success",
          });
      })
      .catch((err) => {
        enqueueSnackbar(`An error occured while creating the course`, {
          variant: "error",
        });
        console.error(err);
      })
      .finally(() => {
        form.reset.click();
        submit.removeAttribute("disabled");
      });
    return true;
  };

  return (
    <Layout user={props.user}>
      <Section title="Create a Course 📑">
        <div
          className="glass container"
          style={{
            marginTop: "10px",
            width: "100%",
            boxSizing: "border-box",
            height: "85%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form
            id="create-course"
            className="glass"
            action="/api/courses/create"
            method="POST"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <label htmlFor="course_name">Course Name</label>
            <input
              type="text"
              className="glass"
              name="course_name"
              id="course_name"
              required
              placeholder="DBMS Normalisation"
            />
            <label htmlFor="file">Upload File</label>
            <input
              type="file"
              className="glass"
              name="file"
              id="file"
              required
            />
            <p className="upload-info">
              File number limit: 1 <br />
              Single file size limit: 4MB <br />
              Allowed file types: Word, Excel, PPT, PDF, Image
            </p>
            <div
              className="row"
              style={{
                flexWrap: "wrap",
              }}
            >
              <button type="submit" id="submit" className="glass">
                Submit
              </button>
              <button type="reset" id="reset" className="glass">
                Reset
              </button>
            </div>
          </form>
        </div>
      </Section>
    </Layout>
  );
}

export default Create;
