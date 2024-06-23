import "./Podcasts.css";
import Section from "./Section";
import Layout from "./Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { enqueueSnackbar } from "notistack";
import { FaRegPlayCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import PodcastPopup from "./PodcastPopup";

function Podcasts({ user, podcasts, setPodcasts }) {
  const navigate = useNavigate();
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const deletePodcast = async (id) => {
    await fetch(`/api/podcasts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success && res.error)
          enqueueSnackbar(res.error || "Podcast Deletion failed", {
            variant: "error",
          });
        else if (res.success)
          enqueueSnackbar(`Podcast deleted successfully`, {
            variant: "success",
          });
      })
      .catch((err) => {
        enqueueSnackbar(`An error occurred while deleting podcast`, {
          variant: "error",
        });
        console.error(err);
      });
  };

  useEffect(() => {
    (async function () {
      try {
        let data = await fetch("/api/podcasts/list", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          method: "GET",
        }).then((res) => res.json());

        setPodcasts(data.podcasts);
      } catch (err) {
        if (err) console.log(err);
      }
    })();
  }, []);

  return (
    <Layout user={user}>
      <Section title="Podcasts 🎙️">
        <div className="glass podcasts">
          {podcasts && podcasts.length > 0 ? (
            podcasts?.map((podcast) => {
              return (
                <div className="podcast glass" key={podcast.id}>
                  <img src={podcast.thumbnail.url} alt="thumbnail" />
                  <h2>
                    <marquee scrollamount={3}>{podcast.title}</marquee>
                  </h2>
                  <p className="characters">
                    {podcast.characters[0].name} &middot;{" "}
                    {podcast.characters[1].name}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <button
                      className="play glass"
                      data-id={podcast.id}
                      onClick={() => setSelectedPodcast(podcast)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <FaRegPlayCircle /> Play
                    </button>
                    <button
                      className="delete glass"
                      data-id={podcast.id}
                      onClick={async (ev) => {
                        localStorage.removeItem("podcast_id");
                        let id = ev.currentTarget.getAttribute("data-id");
                        let confirmation = confirm("Are you sure?");
                        if (confirmation)
                          await deletePodcast(id).then(() => {
                            enqueueSnackbar(`Podcast deletion initiated`, {
                              variant: "info",
                            });
                            window.location.reload();
                          });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <TiDelete /> Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : podcasts && podcasts.length === 0 ? (
            <b style={{ fontFamily: "Quicksand" }}>
              No Podcast found. Create a Podcast to get started ✨
            </b>
          ) : (
            <Box sx={{ width: "100%", height: "30%" }}>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          )}
        </div>
      </Section>
      {selectedPodcast && (
        <PodcastPopup
          open={Boolean(selectedPodcast)}
          podcast={selectedPodcast}
          onClose={() => setSelectedPodcast(null)}
        />
      )}
    </Layout>
  );
}

export default Podcasts;
