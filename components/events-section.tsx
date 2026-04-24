"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import { EventRow } from "./event-row"
import type { SportEvent } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"

const filters = ["Todos", "En Vivo", "Proximos", "Finalizados"]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface EventsSectionProps {
  activeSport: string
}

export function EventsSection({ activeSport }: EventsSectionProps) {
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const { data, error, isLoading } = useSWR<{ events: SportEvent[] }>(
    `/api/events?sport=${activeSport.toLowerCase()}`,
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  )

  useEffect(() => {
    if (!isLoading && data) {
      // Add minimum 2 second delay for better UX
      const timer = setTimeout(() => {
        setIsInitialLoad(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoading, data])

  const events = data?.events || []

  // Group events by status
  const liveEvents = events.filter((e) => e.status === "live")
  const upcomingEvents = events.filter((e) => e.status === "upcoming")
  const finishedEvents = events.filter((e) => e.status === "finished")

  const stats = {
    total: events.length,
    live: liveEvents.length,
    upcoming: upcomingEvents.length,
    finished: finishedEvents.length,
  }

  return (
    <>
      {/* Full-screen loading animation */}
      {isInitialLoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-3 py-2">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden">
            <img
              src="/loading-bg.jpg"
              alt="Loading background"
              className="max-h-[32vh] w-auto object-contain rounded-3xl shadow-lg shadow-slate-900/10 sm:max-h-[38vh]"
            />
            <div className="flex min-h-[95px] w-full max-w-[88vw] flex-col items-center justify-center gap-2 rounded-3xl border border-black/10 bg-black/5 p-4 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:max-w-md sm:p-5">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="h-10 w-10 animate-spin rounded-full border-3 border-black border-t-transparent sm:h-11 sm:w-11"></div>
                  <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border-2 border-black/20 sm:h-11 sm:w-11"></div>
                </div>
              </div>
              <p className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 sm:text-sm">
                Buscando eventos
              </p>
              <p className="text-center text-[11px] leading-5 text-slate-700 sm:text-sm">
                Obteniendo la información más reciente
              </p>
              <p className="text-center text-[10px] uppercase text-red-600 sm:hidden">
                Rote el celular para mejor lectura
              </p>
            </div>
          </div>
        </div>
      )}

      <section id="eventos" className="min-h-screen bg-background pt-28 pb-12 lg:pt-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Stats bar */}
        <div className="mb-6 flex items-center justify-center gap-4 text-center lg:mb-8 lg:gap-6">
          <div>
            <p className="text-2xl font-bold text-foreground lg:text-3xl">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="h-6 w-px bg-border lg:h-8" />
          <div>
            <p className="text-2xl font-bold text-red-500 lg:text-3xl">{stats.live}</p>
            <p className="text-xs text-muted-foreground">En vivo</p>
          </div>
          <div className="h-6 w-px bg-border lg:h-8" />
          <div>
            <p className="text-2xl font-bold text-foreground lg:text-3xl">{stats.upcoming}</p>
            <p className="text-xs text-muted-foreground">Proximos</p>
          </div>
          <div className="h-6 w-px bg-border lg:h-8" />
          <div>
            <p className="text-2xl font-bold text-muted-foreground lg:text-3xl">{stats.finished}</p>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-6 w-6" />
            <span className="ml-3 text-sm text-muted-foreground">Cargando eventos...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12 text-center">
            <p className="text-red-500">Error al cargar. Intenta de nuevo.</p>
          </div>
        )}

        {/* Events List */}
        {!isLoading && !error && (
          <div className="space-y-4 lg:space-y-6">
            {/* Live Events */}
            {liveEvents.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2 lg:mb-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <h2 className="text-sm font-bold uppercase text-red-500">En Vivo ({liveEvents.length})</h2>
                </div>
                <div className="space-y-2">
                  {liveEvents.map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="mb-2 text-sm font-bold uppercase text-muted-foreground lg:mb-3">
                  Proximos ({upcomingEvents.length})
                </h2>
                <div className="space-y-2">
                  {upcomingEvents.map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Finished Events */}
            {finishedEvents.length > 0 && (
              <div>
                <h2 className="mb-2 text-sm font-bold uppercase text-muted-foreground lg:mb-3">
                  Finalizados ({finishedEvents.length})
                </h2>
                <div className="space-y-2">
                  {finishedEvents.map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* No events */}
            {events.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No hay eventos para mostrar</p>
                <p className="mt-1 text-sm text-muted-foreground">Proba seleccionando otro deporte</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center lg:mt-12">
          <p className="text-xs text-muted-foreground">
            Datos de ESPN - Actualizado cada minuto - Horarios en Argentina (UTC-3)
          </p>
        </div>
      </div>
    </section>
  </>
)
}
