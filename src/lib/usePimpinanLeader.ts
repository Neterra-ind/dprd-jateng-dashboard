import { useSearchParams } from 'react-router-dom';
import { leadershipList } from '../data/pimpinanAktivitas';
import { anggotaById } from '../data/anggota';

export function usePimpinanLeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const leaderId = searchParams.get('leader') ?? leadershipList[0]?.id;
  const leader = anggotaById(leaderId) ?? leadershipList[0];

  const setLeaderId = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('leader', id);
    setSearchParams(next, { replace: true });
  };

  return { leader, leaderId: leader.id, setLeaderId, leadershipList };
}
