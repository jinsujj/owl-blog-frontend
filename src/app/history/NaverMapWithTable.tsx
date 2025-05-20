'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CoordinateVO, getVisitorCoordinatesHistory } from '../api/historyApi';

const Wrapper = styled.div`
  margin-top: 2rem;
`;

const TableWrapper = styled.div`
  max-height: 500px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  padding: 8px;
  border: 1px solid #ccc;
  font-weight: bold;
  background-color: #f9f9f9;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Td = styled.td`
  padding: 8px;
  border: 1px solid #ccc;
`;

export default function NaverMapWithTable({ from, to, ip }: { from: string; to: string; ip: string }) {
	const [coordinates, setCoordinates] = useState<CoordinateVO[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getVisitorCoordinatesHistory(from, to, ip);
			if (data) {
				const sorted = data.sort((a, b) => {
					if (a.ip < b.ip) return -1;
					if (a.ip > b.ip) return 1;
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				});
				setCoordinates(sorted);
			}
		};
		fetchData();
	}, [from, to, ip]);

	return (
		<Wrapper>
			<TableWrapper>
				<Table>
					<thead>
						<tr>
							<Th>IP</Th>
							<Th>국가</Th>
							<Th>도시</Th>
							<Th>위도</Th>
							<Th>경도</Th>
							<Th>블로그 제목</Th>
							<Th>방문 시간</Th>
						</tr>
					</thead>
					<tbody>
						{(() => {
							const colorList = ['#f9fafb', '#eef1f6'];
							const ipColorMap = new Map<string, string>();
							let colorIndex = -1;
							let prevIp = '';

							return coordinates.map((c, i) => {
								if (c.ip !== prevIp) {
									colorIndex = (colorIndex + 1) % colorList.length;
									prevIp = c.ip;
									ipColorMap.set(c.ip, colorList[colorIndex]);
								}

								return (
									<tr key={i} style={{ backgroundColor: ipColorMap.get(c.ip) }}>
										<Td>{c.ip}</Td>
										<Td>{c.country}</Td>
										<Td>{c.city}</Td>
										<Td>{c.lat}</Td>
										<Td>{c.lon}</Td>
										<Td>{c.blogTitle}</Td>
										<Td>{new Date(c.createdAt).toLocaleString()}</Td>
									</tr>
								);
							});
						})()}
					</tbody>

				</Table>
			</TableWrapper>
		</Wrapper>
	);
}
