import React from "react";
import { Modal, TextArea } from "@react95/core";
import styled from "@xstyled/styled-components";
import Frame from "@react95/core/Frame";

function formatQtd(ingredient) {
  if (!ingredient.Quantidade && !ingredient.Medida) {
    return "";
  } else if (ingredient.Medida === "Inteiros") {
    return ingredient.Quantidade;
  } else if (ingredient.Quantidade && ingredient.Medida) {
    return `${ingredient.Quantidade} ${ingredient.Medida}`;
  }
}

async function share({ title, text }) {
  await navigator.share({
    title,
    text: `*${title}*
    
${text}`,
    url: "https://ggdaltoso.dev/95Recipes/",
  });
}

const ImgGrid = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr;
  padding: 2;

  img {
    width: 100%;
  }
`;

const RecipeModal = ({ selectedRecipe, closeModal, isMobile }) => {
  console.log("RecipeModal -> selectedRecipe", selectedRecipe);
  const text = `Ingredients:

${selectedRecipe.ingredients
  .map((i) => {
    const measure = formatQtd(i);
    return `${measure} ${i.Ingredientes} ${!measure ? " a gosto" : ""} ${i[
      "Observação"
    ] && ` - (${i["Observação"].toLowerCase()})`}`;
  })
  .join("\n")}


How to prepare:

${
  selectedRecipe.preparation.length > 0
    ? selectedRecipe.preparation
        .map((i, index) => `${index + 1}. ${i.Ingredientes}`)
        .join("\n")
    : ""
}

`;

  const boxProps = {
    width: isMobile ? window.innerWidth : undefined,
    height: isMobile ? window.innerHeight - 30 : "auto",
  };

  return (
    <Modal
      {...boxProps}
      style={{ top: 0 }}
      icon="file_text"
      title={selectedRecipe.name}
      closeModal={closeModal}
      buttons={[
        ...(navigator.share !== undefined
          ? [
              {
                value: "Share",
                onClick: () => share({ title: selectedRecipe.name, text }),
              },
            ]
          : []),
        { value: "Close", onClick: closeModal },
      ]}
    >
      <TextArea legend="Ingredients" value={text} rows={30} readOnly />
      {selectedRecipe.images.length > 0 && (
        <Frame boxShadow="in">
          <ImgGrid>
            {selectedRecipe.images.map((i) => (
              <img src={`https://drive.google.com/uc?id=${i}`} key={i} />
            ))}
          </ImgGrid>
        </Frame>
      )}
    </Modal>
  );
};

export default RecipeModal;
