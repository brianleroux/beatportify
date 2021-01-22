import arc from "@architect/functions";
import { get } from "tiny-json-http";

import { API_URL, buildUrl, makeResponse } from "@architect/shared/utils";
import { getTracksAudio } from "@architect/shared/audio";

import type { ApiRequest } from "@typings/index";
import type { ArcHeaders } from "@typings/arc";
import type { PagingObject, Artist, Album, Track } from "@typings/spotify";

interface PagingKeys {
  limit: string | number;
  offset: string | number;
}

interface PagingKeysAlbum extends PagingKeys {
  // include_groups: "album" | "single" | "appears_on" | "compilation"
  include_groups: string;
  market: string;
}

interface Res<T> {
  body: T;
}

type ArtistRes = Res<Artist>;
type AlbumRes = Res<PagingObject<Album>>;
type TopTracksRes = Res<{ tracks: Track[] }>;
type RelatedArtistRes = Res<{ artists: Artist[] }>;

function getArtist(artistId: string, headers: ArcHeaders): Promise<ArtistRes> {
  return get({
    url: `${API_URL}/artists/${artistId}`,
    headers,
  });
}

function getTopTracks(artistId: string, headers: ArcHeaders): Promise<TopTracksRes> {
  const url = buildUrl({
    endpoint: `/artists/${artistId}/top-tracks`,
    params: { market: "from_token" },
  });

  return get({ url, headers });
}

function getAlbums(
  artistId: string,
  headers: ArcHeaders,
  params: Partial<PagingKeysAlbum> = {}
): Promise<AlbumRes> {
  const url = buildUrl({
    endpoint: `/artists/${artistId}/albums`,
    params: { ...params, market: "from_token" },
  });

  return get({ url, headers });
}

function getRelatedArtists(artistId: string, headers: ArcHeaders): Promise<RelatedArtistRes> {
  return get({
    url: `${API_URL}/artists/${artistId}/related-artists`,
    headers,
  });
}

const getArtistData: ApiRequest = async (req, headers) => {
  const artistId = req.params.artistId;

  const requestMap = {
    artist: getArtist,
    albums: getAlbums,
    relatedArtists: getRelatedArtists,
    topTracks: getTopTracks,
  };

  const responses = await Promise.allSettled(
    Object.values(requestMap).map((fn) => fn(artistId, headers))
  );

  const data: Record<string, unknown> = {};
  let index = 0;
  for (const key of Object.keys(requestMap)) {
    const res = responses[index++];

    if (res.status === "rejected") {
      data[key] = { error: res.reason };
      continue;
    }

    if (key === "topTracks") {
      const { tracks: topTracks } = (res.value as TopTracksRes).body;
      data[key] = await getTracksAudio(topTracks, headers);
      continue;
    }

    data[key] = res.value.body;
  }

  return data;
};

export const handler = arc.http.async(makeResponse(getArtistData));
