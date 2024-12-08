<?php

include "../codes/connection.php";

include "movie_controller.php";
include "photo_controller.php";
include "video_controller.php";
include "cast_controller.php";

function createMovieWithAssets($conn, $userId, $title, $overview, $popularity, $releaseDate, $voteAverage, $backdropPath, $posterPath, $isFeatured, $photos, $videos, $cast) {
    try {
        $conn->beginTransaction();

        // Step 1: Insert the movie
        $query = "INSERT INTO Movies (userId, title, overview, popularity, releaseDate, voteAverage, backdropPath, posterPath, isFeatured) 
                  VALUES (:userId, :title, :overview, :popularity, :releaseDate, :voteAverage, :backdropPath, :posterPath, :isFeatured)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':overview', $overview);
        $stmt->bindParam(':popularity', $popularity);
        $stmt->bindParam(':releaseDate', $releaseDate);
        $stmt->bindParam(':voteAverage', $voteAverage);
        $stmt->bindParam(':backdropPath', $backdropPath);
        $stmt->bindParam(':posterPath', $posterPath);
        $stmt->bindParam(':isFeatured', $isFeatured, PDO::PARAM_BOOL);

        $stmt->execute();
        $movieId = $conn->lastInsertId();

        // Step 2: Insert photos
        foreach ($photos as $photo) {
            addPhoto($conn, $movieId, $userId, $photo['url'], $photo['description']);
        }

        // Step 3: Insert videos
        foreach ($videos as $video) {
            addVideo($conn, $movieId, $userId, $video['url'], $video['name'], $video['site'], $video['videoKey'], $video['videoType'], $video['official']);
        }

        // Step 4: Insert cast (allow multiple cast members per movie)
        foreach ($cast as $castMember) {
            addCastMember($conn, $movieId, $userId, $castMember['name'], $castMember['url'], $castMember['characterName']);
        }


        $conn->commit();
        return "Movie, photos, videos, and cast added successfully!";
    } catch (Exception $e) {
        $conn->rollBack();
        return "Error creating movie: " . $e->getMessage();
    }
}

?>
