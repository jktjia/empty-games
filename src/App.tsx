import { Card } from './components/ui/card'
import EmptyProvider from './contexts/empty-provider'
import MergeGame from './components/merge-game'

function App() {
  return (
    <div className="text-center w-full h-screen">
      <EmptyProvider>
        <div className="container mx-auto p-8 text-center relative z-10 max-w-xl h-full justify-center items-center flex">
          <Card className="bg-card/50 backdrop-blur-sm border-muted w-full h-fit">
            <MergeGame />
          </Card>
        </div>
      </EmptyProvider>
    </div>
  )
}

export default App
