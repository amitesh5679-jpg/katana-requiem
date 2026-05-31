export interface HashiraTitle {
  title: string
  holder: string
  desc: string
  anime: string
  color: string
  bgColor: string
  type: "hashira" | "upper-moon" | "demon-lord"
}

export interface ChessPlayerProfile {
  username: string
  avatar?: string
  player_id?: number
  url?: string
  name?: string
  title?: string
  followers?: number
  country?: string
  location?: string
  last_online?: number
  joined?: number
  status?: string
  is_streamer?: boolean
}

export interface ChessPlayerStats {
  chess_blitz?: {
    last?: {
      rating: number
      date: number
      rd: number
    }
    best?: {
      rating: number
      date: number
      game: string
    }
    record?: {
      win: number
      loss: number
      draw: number
    }
  }
  chess_rapid?: {
    last?: {
      rating: number
      date: number
      rd: number
    }
    best?: {
      rating: number
      date: number
      game: string
    }
    record?: {
      win: number
      loss: number
      draw: number
    }
  }
  chess_bullet?: {
    last?: {
      rating: number
      date: number
      rd: number
    }
    best?: {
      rating: number
      date: number
      game: string
    }
    record?: {
      win: number
      loss: number
      draw: number
    }
  }
}

export interface PlayerData {
  profile: ChessPlayerProfile
  stats: ChessPlayerStats
}
