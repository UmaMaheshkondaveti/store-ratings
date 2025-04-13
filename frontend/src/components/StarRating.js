// src/components/StarRating.js

"use client"

import React from "react"

const StarRating = ({ rating = 0 }) => {
  const stars = []

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? "#ffc107" : "#e4e5e9", fontSize: "1.2rem" }}>
        ★
      </span>
    )
  }

  return <div>{stars}</div>
}

export default StarRating
