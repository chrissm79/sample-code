import React from 'react'
import {
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated'

type ProgramContextValue = {
  animateNext: () => void
  nativeID: string | undefined
  duration: number
}

export const ProgramContext = React.createContext<
  ProgramContextValue | undefined
>(undefined)

type Props = {
  duration?: number
  nativeID?: string
}

export const ProgramProvider: React.FC<Props> = ({
  children,
  duration = 300,
  nativeID = undefined,
}) => {
  const transitioningView = React.useRef<TransitioningView>()
  const transition = React.useRef(
    <Transition.Change durationMs={300} interpolation="easeInOut" />
  )

  const animateNext = React.useCallback(() => {
    if (transitioningView.current) {
      transitioningView.current.animateNextTransition()
    }
  }, [transitioningView])

  return (
    <ProgramContext.Provider value={{ animateNext, nativeID, duration }}>
      <Transitioning.View
        style={{ flex: 1 }}
        transition={transition.current}
        ref={transitioningView}
      >
        {children}
      </Transitioning.View>
    </ProgramContext.Provider>
  )
}

export const useProgramTransition = () => {
  const context = React.useContext(ProgramContext)

  if (context === undefined) {
    throw new Error(
      `useProgramTransition must be used within the ProgramProvider`
    )
  }

  return context
}
