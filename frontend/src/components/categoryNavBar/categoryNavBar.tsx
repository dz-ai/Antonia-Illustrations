import React from "react";
import {categories} from "../../types/types";


export function CategoryNavBar({categories}: { categories:categories }) {
    return (

        <div className="category-navbar">
            {
                categories.map((category, index) =>
                    <button key={index}>{category}</button>
                )
            }
        </div>
    );
}