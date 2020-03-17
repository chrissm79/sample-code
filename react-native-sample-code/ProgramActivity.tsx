import React from 'react'
import { graphql, useFragment } from 'react-relay/hooks'
import { ProgramActivity_activity$key } from '@influence/graphql/ProgramActivity_activity.graphql'
import { View } from 'react-native'
import { ProgramStation } from './ProgramStation'
import { Button } from '../buttons'
import { InputReferenceMap } from './program.types'

const fragment = graphql`
  fragment ProgramActivity_activity on Activity {
    id
    name
    stations {
      exercise {
        id
      }
      ...ProgramStation_station
    }
  }
`

type Props = {
  activity: ProgramActivity_activity$key
  onAddExercises?: (activityID: string) => void
  onViewExercise?: (exerciseID: string) => void
}

export const ProgramActivity: React.FC<Props> = ({
  activity,
  onAddExercises = undefined,
  onViewExercise = undefined,
}) => {
  const data = useFragment(fragment, activity)
  const inputs = React.useRef<InputReferenceMap>(new Map())

  const handleAddExercises = () => onAddExercises(data.id)

  const handleOnNext = React.useCallback(
    (nextIndex: number) => {
      const input = inputs.current.get(`${nextIndex}`)
      if (input && !!input.focus) {
        input.focus()
      }
    },
    [inputs]
  )

  const handleViewHistory = React.useCallback(
    (id: string) => {
      if (onViewExercise === undefined) {
        return undefined
      }

      return () => onViewExercise(id)
    },
    [onViewExercise]
  )

  return (
    <View>
      {data.stations.map((station, i) => (
        <ProgramStation
          key={station.__id}
          station={station}
          onNext={() => handleOnNext(i + 1)}
          onViewHistory={handleViewHistory(station.exercise.id)}
          ref={input => inputs.current.set(`${i}`, input)}
        />
      ))}
      {onAddExercises !== undefined && (
        <Button type="dashed" onPress={handleAddExercises}>
          Add Exercise(s)
        </Button>
      )}
    </View>
  )
}
