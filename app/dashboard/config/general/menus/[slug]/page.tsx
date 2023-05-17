import React from "react";

const DetailsMenu = ({ params }: { params: { slug: string } }) => {
  return <div>DetailsMenu {params.slug}</div>;
};

export default DetailsMenu;
