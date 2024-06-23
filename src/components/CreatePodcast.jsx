import "./CreatePodcast.css";
import Layout from "./Layout";
import Section from "./Section";
import { enqueueSnackbar } from "notistack";
import { SiTwilio } from "react-icons/si";

function CreatePodcast(props) {
  const voices = ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"];

  const handleFetch = async (interactive, payload, form, submit) => {
    await fetch(form.action + `?interactive=${interactive}`, {
      method: form.method,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success && res.error)
          enqueueSnackbar(res.error || "Podcast creation failed", {
            variant: "error",
          });
        else
          enqueueSnackbar(`Podcast creation initiated`, {
            variant: "success",
          });
      })
      .catch((err) => {
        enqueueSnackbar(`An error occured while creating the Podcast`, {
          variant: "error",
        });
        console.error(err);
      })
      .finally(() => {
        form.reset.click();
        submit.removeAttribute("disabled");
      });
  };

  const launchInteractiveDiscussion = async (ev) => {
    let form = document.forms[0];
    let submit = document.getElementById("submit");
    submit.setAttribute("disabled", true);

    let formData = new FormData(form);

    const payload = {
      topic: form.topic.value,
      characters: [
        {
          name: formData.get(["character[0].name"]),
          voice: formData.get(["character[0].voice"]),
        },
        {
          name: formData.get(["character[1].name"]),
          voice: formData.get(["character[1].voice"]),
        },
      ],
      ph: prompt("Enter your phone number: ").replaceAll(/\s*/g, ""),
    };

    if (
      !payload.characters[0].name ||
      !payload.characters[1].name ||
      !payload.characters[0].voice ||
      !payload.characters[1].voice ||
      !payload.topic ||
      !payload.ph
    ) {
      enqueueSnackbar(`All fields are required.`, {
        variant: "error",
      });
      return false;
    }

    await handleFetch(true, payload, form, submit);
    return true;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    let form = document.forms[0];
    let submit = document.getElementById("submit");
    submit.setAttribute("disabled", true);

    let formData = new FormData(form);

    const payload = {
      topic: form.topic.value,
      characters: [
        {
          name: formData.get(["character[0].name"]),
          voice: formData.get(["character[0].voice"]),
        },
        {
          name: formData.get(["character[1].name"]),
          voice: formData.get(["character[1].voice"]),
        },
      ],
    };

    await handleFetch(false, payload, form, submit);

    return true;
  };

  return (
    <Layout user={props.user}>
      <Section title="Create a Podcast 🎼">
        <div
          className="glass container"
          style={{
            marginTop: "10px",
            width: "100%",
            boxSizing: "border-box",
            height: "85%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <form
            id="create-podcast"
            className="glass"
            action="/api/podcasts/create"
            method="POST"
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="topic"
              style={{
                fontSize: "1em",
              }}
            >
              Topic
            </label>
            <input
              type="text"
              className="glass"
              name="topic"
              required
              placeholder="Future of Artificial Intelligence"
            />
            <div
              className="row"
              style={{
                gap: "10px",
              }}
            >
              <fieldset>
                <legend>Character 1</legend>
                <input
                  type="text"
                  name="character[0].name"
                  className="glass"
                  required
                  placeholder="Elon Musk"
                />
                <label htmlFor="character[0].voice">
                  <br />
                  Voice:{" "}
                  <select name="character[0].voice" className="glass" required>
                    {voices.map((voice) => {
                      return <option value={"en-us-" + voice + "MultilingualNeural"}>{voice}</option>;
                    })}
                  </select>
                </label>
              </fieldset>
              <fieldset>
                <legend>Character 2</legend>
                <input
                  type="text"
                  name="character[1].name"
                  className="glass"
                  required
                  placeholder="Sam Altman"
                />
                <label htmlFor="character[1].voice">
                  <br />
                  Voice:{" "}
                  <select name="character[1].voice" className="glass" required>
                    {voices.map((voice) => {
                      return <option value={"en-us-" + voice + "MultilingualNeural"}>{voice}</option>;
                    })}
                  </select>
                </label>
              </fieldset>
            </div>
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
          <button 
            id="launch-interactive-discussion" 
            className="glass" 
            onClick={launchInteractiveDiscussion}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              backgroundColor: "gold"
            }}
          >
            Launch an Interactive Discussion 
            <SiTwilio style={{ color: "rgb(255, 0, 0)" }} />
          </button>
        </div>
      </Section>
    </Layout>
  );
}

export default CreatePodcast;
