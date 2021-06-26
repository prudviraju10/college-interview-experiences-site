import React from "react";
import articles from "./articlecontent";
const viewingpost = ({ match }) => {
  const name = match.params.name;
  console.log(name);
  const article = articles.find((article) => article.name === name);
  if (!article) return <h1>Post doesn't exist!!</h1>;
  return (
    <>
      <h1>{article.title}</h1>
      {article.content.map((paragraph, key) => (
        <p key={key}>{paragraph}</p>
      ))}
    </>
  );
};

export default viewingpost;
