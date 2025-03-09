import { addSeriesToBlog, createSeries, getBlogSummary, getSeries, Post, Series } from "@/app/api/blogApi";
import { useSelector } from "@/app/store";
import { useEffect, useState } from "react"
import { HiTrash } from "react-icons/hi2";
import styled from "styled-components";

const SeriesContainer = styled.div`
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
`;

const SeriesItem = styled.div`
  margin-bottom: 20px;
`;

const SeriesTitle = styled.h3`
  cursor: pointer;
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
`;

const Input = styled.input`
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
  
  &:hover {
    color: #b02a37;
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #0070f3;
  color: white;

  &:hover {
    background-color: #005bb5;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  width: 200px;
`;

const SeriesView = () => {
	const isLogged = useSelector((state) => state.auth.isLogged);
	const [series, setSeries] = useState<Series[]>([]);
	const [seriesMap, setSeriesMap] = useState<{ [key: string]: Post[] }>({});
	const [openSeries, setOpenSeries] = useState<string | null>(null);
	const [newSeriesName, setNewSeriesName] = useState("");
	const [allBlogs, setAllBlogs] = useState<Post[]>([]);
	const [selectedBlog, setSelectedBlog] = useState<number | null>(null);
	const [selectedSeries, setSelectedSeries] = useState<string>("");


	useEffect(() => {
		const fetchSeries = async () => {
			try {
				const data = await getSeries();
				console.log(data);
				setSeries(data||[]);
			} catch (error) {
				console.error("Failed to fetch series", error);
			}
		};

		const fetchBlogs = async () => {
			try {
				const blogs = await getBlogSummary();
				setAllBlogs(blogs);
			} catch (error) {
				console.error("Failed to fetch blogs", error);
			}
		};

		fetchSeries();
		fetchBlogs();
	}, []);

	const handleAddSeries = async (seriesName: string) => {
		if (!seriesName.trim()) return;
		try {
			console.log(seriesName);
			await createSeries(seriesName);
			setSeriesMap((prev) => ({ ...prev, [seriesName]: [] }));
			setNewSeriesName("");
		} catch (error) {
			console.error("Failed to create series", error);
		}
	};

	const handleAddSeriesToBlog = async () => {
		if (!selectedBlog || !selectedSeries) return;
		try {
			const blog = allBlogs.find((b) => b.id === selectedBlog);
			if (!blog) return;

			await addSeriesToBlog(selectedSeries, selectedBlog);
			setSeriesMap((prev) => ({
				...prev,
				[selectedSeries]: [...(prev[selectedSeries] || []), blog],
			}));
			setSelectedBlog(null);
		} catch (error) {
			console.error("Failed to add blog to series", error);
		}
	};


	const toggleSeries = (seriesName: string) => {
		setOpenSeries(openSeries === seriesName ? null : seriesName);
	}

	return (
		<SeriesContainer>
			{isLogged && (
        <>
          <h3>📌 시리즈 관리</h3>
          <div>
            <Input
              type="text"
              value={newSeriesName}
              onChange={(e) => setNewSeriesName(e.target.value)}
              placeholder="새 시리즈 이름 입력"
            />
            <Button onClick={() => {handleAddSeries(newSeriesName)}}>시리즈 추가</Button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <h3>블로그를 시리즈에 추가</h3>
            <Select onChange={(e) => setSelectedSeries(e.target.value)} value={selectedSeries}>
              <option value="">시리즈 선택</option>
              {series.map((data) => (
								<option key={data.name} value={data.name}>{data.name}</option>
							))}
            </Select>

            <Select onChange={(e) => setSelectedBlog(Number(e.target.value))} value={selectedBlog || ""}>
              <option value="">블로그 선택</option>
              {allBlogs.map((blog) => (
                <option key={blog.id} value={blog.id}>{blog.title}</option>
              ))}
            </Select>

            <Button onClick={() => {handleAddSeriesToBlog()}}>블로그 추가</Button>
          </div>
        </>
      )}
			{Object.keys(seriesMap).map((seriesName) => (
				<SeriesItem key={seriesName}>
					<SeriesTitle onClick={() => toggleSeries(seriesName)}>
						<span>{seriesName} ({seriesMap[seriesName].length}개)</span>
						{isLogged &&
							<DeleteButton onClick={(e) => {
								e.stopPropagation(); // 부모 클릭 이벤트 방지
								handleAddSeries(seriesName);
							}}>
								<HiTrash />
							</DeleteButton>
						}
					</SeriesTitle>
					{openSeries === seriesName && (
						<ul>
							{seriesMap[seriesName].map((post) => (
								<li key={post.id}>{post.title}</li>
							))}
						</ul>
					)}
				</SeriesItem>
			))}
		</SeriesContainer>
	);
};


export default SeriesView;