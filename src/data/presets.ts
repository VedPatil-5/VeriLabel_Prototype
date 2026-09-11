import { SampleDataset, TeamMember } from '../types';
import sample1Data from './samples/sample1.json';
import sample2Data from './samples/sample2.json';
import sample3Data from './samples/sample3.json';
import sample4Data from './samples/sample4.json';
import sample5Data from './samples/sample5.json';
import sample6Data from './samples/sample6.json';

export const SAMPLE_DATASETS: SampleDataset[] = [
  sample1Data as SampleDataset,
  sample2Data as SampleDataset,
  sample3Data as SampleDataset,
  sample4Data as SampleDataset,
  sample5Data as SampleDataset,
  sample6Data as SampleDataset
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'rishab',
    name: 'Rishab Pai',
    role: 'Team Leader & AI',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANt-WJWciOXtVjF9gh1YY3641RSW4LEG9BKgtKxaF6sYrLHJANKRawd9ozzbla3qp7CKToCDF0-FWlczFEt4wjKOuxpBzVBQ9aRLX9hEfgSD4zZJj0sdwMSBgdZ2LUWuEymoCXoh-JdgXvrentrV4Yg8UOMYl_AaQaF4zXZVGPjhajUKTo9BPQmQMVQ7Z80tj9rMCUdQ1VIoXE0MUTCwb4EncY7aoXY5NaeVV7PyNtbVEjDnAM9gfi8BI26okcpUltedhUqakT0rjtbLI',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'ved',
    name: 'Ved Patil',
    role: 'Fullstack & UI/UX Designer',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD80YWe_W3AzFWTf88oFY2yRovfiUIoy0aPur60RQVx_yBgT6eDhMruMghzei1iONOavi0aL5Pq4KetHIWJTNrkmfNqm33SsNcEPA5GMJxLVX3-2vvYwCgre__B_cOuF_5pIbQUqo2Wxw1uzRsvmmoyuDSnY-nVy74UeSc3gc7fv86y2i0vDDn67cnCURP0d8ZiWCdfZSh6LEYKFNyGIweaShoB0AggyK8yOx94g3kuQrCeuaRQ1WAkTPVv8taQDGzjLMFy8hPmhaIzUns',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'chetan',
    name: 'Chetan Choudhary',
    role: 'Computer Vision & OCR Pipeline',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLY4TkIDEi0crUMdt6UxR_VnIpLCSYe_kBGVBKQSnSeGxvxBR0B_S89V7KrxEMjDQDYRBmyHnQowhxi1i6dDiguvdm-S4qwJQ8555j05tqcW1DXAAN0OkYxJwQhNKq3KnvAoxwsA8xcGr1fmoNJz6cB83b_duLzMgpJtq4whA-jp9_C8yacEYGXh03geb40tbDhGdc_t7VpjUu_xqoKW5J0-VWnh_7bvLQu5KvI8BKcgM6S-AuVt0Gq7xoGza0nGef5XSiCtbyUM6Iq3A',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'tanmay',
    name: 'Tanmay Padhyal',
    role: 'AI & Computer Vision',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt8zB0ZX6f_qrn6VJ1UAJeDzG_41oV6-udZg-DhTVUARUXKFQIwGv0oDxtlS6Od9yVErf83WZTUabjZrjmAgTZ71tJr0tIU3LMV-rU0gne_qVb1OkvPI6DCvchfQXHZcJhET9LcM6ZRfwQF_FXt2RTCxNlK7054TnOzRF_nPYKmwtDFTuuOoqe29LMnT8K0tzGQYVZtEooDJ_3qbrYE00xWynHeXqp9m63jICN-K5NA6o5ghj4lRu3vNT19NQkTQYCvWkkK9iXnTLjFtM',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'jay',
    name: 'Jay Shirodkar',
    role: 'Backend & QA',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPIoQ4cPO6JgS39XswsHOemPDf8vK3PWcbotM7rUgEPRgpNX13hXHqSy1ikJ64wMslzjmhHLODFPY6y8oa8PDsbCplptNJcRYqp2z8S1g4i1G8Dt24JGVc_719GCaIFOtBsawvQzlR5rtS_mce_nhccM8vlBlGAMogLNTr8CL5ASu1eV3Go06LH7XFuPs_7H5-6DEOdCaP71AVS00vck3lpqRmaE5rkk6cE9ASsjfT945mIT_JMWFvRU4VO9WB8lwyQ5EJu-94m-4pFj4',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'samriddhi',
    name: 'Samriddhi Jaggi',
    role: 'Frontend & Product Research',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMwYXStx0UgmuZWpbwMJKPlh3HAVVqxaTIBoOQygziGb8PzAzDQjtgjpPgOZ1-ZHlDRYBK5XZKr7GiyAwPx_vWfNtvIClUu85dVok8FFbJlztJoJ8ExFiD4ar3ZATn5zZSje2X5Ad84gv40HDvHA4YP4U7ioAFQ4Y-YukvQBES6GHBAdUWrx4V0SHr-aTNy023FhcHKS7BhanGJaxAfK9xwetuWQMPaTmwHzXjABskID84gBJN5UEEMLSkXGr6DwyGgPV6oK5pmU_XhGs',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com'
  }
];
