import type * as Portify from "@typings/app";
import type * as SpotifyApi from "@typings/spotify";

export function processAlbum(itemAlbum: SpotifyApi.SimplifiedAlbum): Portify.Album {
  const { album_type, artists, id, images, name, uri } = itemAlbum;

  return {
    id,
    album_type,
    artists,
    images,
    name,
    uri,
  };
}

export function processTrack(item: SpotifyApi.Track): Portify.Track {
  const { album, artists, duration_ms, id, is_playable, name, uri } = item;

  return {
    album: processAlbum(album),
    artists,
    duration_ms,
    id,
    is_playable,
    name,
    uri,
  };
}
