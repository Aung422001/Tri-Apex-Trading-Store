import type { Metadata } from 'next'
import ShowcaseMatrix from './ShowcaseMatrix'

export const metadata: Metadata = {
    title: 'Project Showcase',
    description: 'Every API route of the Triapex Trading Group store in one interactive view: who can call it, which screen uses it, and how it is guarded.',
}

export default function ShowcasePage() {
    return <ShowcaseMatrix />
}
