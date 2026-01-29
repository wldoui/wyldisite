document.getElementById("form").onsubmit = async e => {
    e.preventDefault();

    const data = new FormData(e.target);

    const res = await fetch("/process", {
        method: "POST",
        body: data
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "posterized.mp4";
    a.click();
};
