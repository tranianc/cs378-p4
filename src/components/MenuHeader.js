import React from 'react';


// This is a functional component that represents a single menu item. It currently takes in the title and displays it in an h2 element.
// Modify the component to take in all the other properties of a menu item you need and display them in the component.
// Use bootstrap to style the elements so that it looks like the mockup in the assignment.
// Hint: You can use the image name to get the image from the images folder.
const MenuHeader = ({ bottle, description, title, imageName}) => {
	const imagePath = `${process.env.PUBLIC_URL}/images/${imageName}`;
	console.log(`getting image in ${imagePath}`);
	return (
		<div>
			<header className="text-center header mx-auto">
				<img src={imagePath} alt={title} className="me-3 logo"/>
				<p className="lead desc">{description}</p>
				<h2 className="h2 bottle">{bottle}</h2>
			</header>
		</div>
    );
};

export default MenuHeader;
