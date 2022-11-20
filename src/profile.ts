import { store } from "@graphprotocol/graph-ts"

import {
  ProfileCreated,
  ProfileImageUpdated,
  DefaultProfileUpdated,
  FollowNFTMinted,
  FollowNFTBurned,
} from "../generated/ContentBaseProfileV1/ContentBaseProfileV1"
import { Profile, Follow } from "../generated/schema"

export function handleProfileCreated(event: ProfileCreated): void {
  const {
    profileId,
    owner,
    handle,
    originalHandle,
    imageURI,
    isDefault,
    timestamp,
  } = event.params

  const id = profileId.toString()
  let profile = Profile.load(id)

  if (!profile) {
    profile = new Profile(id)
  }
  profile.owner = owner
  profile.handle = handle
  profile.originalHandle = originalHandle
  profile.imageURI = imageURI
  profile.default = isDefault
  profile.createdAt = timestamp
  profile.save()
}

export function handleProfileImageUpdated(event: ProfileImageUpdated): void {
  const { profileId, imageURI, timestamp } = event.params
  const id = profileId.toString()
  let profile = Profile.load(id)

  if (profile) {
    profile.imageURI = imageURI
    profile.updatedAt = timestamp
    profile.save()
  }
}

export function handleDefaultProfileUpdated(
  event: DefaultProfileUpdated
): void {
  const { newProfileId, oldProfileId, timestamp } = event.params

  // Update the new default profile.
  const newDefaultProfile = Profile.load(newProfileId.toString())
  if (newDefaultProfile) {
    newDefaultProfile.default = true
    newDefaultProfile.updatedAt = timestamp
    newDefaultProfile.save()
  }

  // Update the old default profile.
  const oldDefaultProfile = Profile.load(oldProfileId.toString())
  if (oldDefaultProfile) {
    oldDefaultProfile.default = false
    oldDefaultProfile.updatedAt = timestamp
    oldDefaultProfile.save()
  }
}

export function handleFollow(event: FollowNFTMinted): void {
  const { tokenId, followerId, followeeId, owner, timestamp } = event.params
  const id = tokenId.toString()
  let follow = Follow.load(id)

  if (!follow) {
    follow = new Follow(id)
  }
  follow.follower = followerId.toString()
  follow.followee = followeeId.toString()
  follow.owner = owner
  follow.createdAt = timestamp
  follow.save()
}

export function handleUnFollow(event: FollowNFTBurned): void {
  const { tokenId } = event.params
  const id = tokenId.toString()
  const follow = Follow.load(id)

  // Remove the follow entity from the store.
  if (follow) {
    store.remove("FOLLOW", id)
  }
}
