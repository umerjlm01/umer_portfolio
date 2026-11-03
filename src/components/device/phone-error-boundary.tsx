"use client"

import React, { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  /** Optional fallback rendered if the children throw. Defaults to null (transparent). */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * ErrorBoundary for the 3D phone canvas. If WebGL fails to initialize, the
 * GLB model fails to load, or any render error occurs, this catches it and
 * renders the fallback (transparent by default) instead of crashing the
 * whole hero or leaving a white/empty canvas container.
 */
export class PhoneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Log but don't crash the page — the hero still works without the 3D phone.
    console.warn("[PhoneCanvas] 3D phone failed to render, showing fallback:", error)
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback ?? null}</>
    }
    return this.props.children
  }
}
