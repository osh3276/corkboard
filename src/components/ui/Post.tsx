import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FC } from "react";

interface PostProps {
  postID: number;
  author: string;
  date: string;
  content: string;
}

const Post: FC<PostProps> = ({ postID, author, date, content }) => {
  return (
    <Card className="max-w-sm mx-0 mb-2.5 text-wrap">
      {/* Card Header */}
      <CardHeader>
        <div className="flex justify-between text-sm gap-1.5 text-muted-foreground">
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="text-2xl overflow-y-auto max-h-100 text-pretty break-words">
        <p>{content}</p>
      </CardContent>

      {/* Card Footer */}
      <CardFooter>
        <span className="text-xs text-muted-foreground">#{postID}</span>
      </CardFooter>
    </Card>
  );
};

export default Post;
